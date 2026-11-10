async (page) => {
  const base = 'https://osiali.vercel.app';
  const status = page.locator('#input-status');
  const evidence = page.locator('#evidence');
  const startManual = async (identifier) => {
    await page.locator('#identifier').fill(identifier);
    await page.locator('#identifier-form button').click();
    await page.waitForFunction(() =>
      document.querySelector('#input-status')?.textContent.includes('Paste matching official'),
      null, { timeout: 15000 }
    );
  };

  await page.goto(base + '/?demo=F1');

  // A matching user-supplied identifier is accepted only as provisional evidence.
  const firstId = 'audit-corr-1';
  await startManual(firstId);
  const matchingPayload = {
    status: 'FAILED',
    correlationId: firstId,
    originTxHashes: ['0x' + 'a'.repeat(64)]
  };
  await evidence.fill(JSON.stringify(matchingPayload));
  await page.locator('#trace').click();
  await page.waitForFunction(() =>
    document.querySelector('#input-status')?.textContent.includes('Provisional analysis')
  );
  if (!(await page.locator('#classification').innerText()).includes('Failed')) {
    throw Error('Matching evidence did not produce a bounded diagnosis');
  }
  const firstBundle = JSON.parse(await page.locator('#preview').textContent());
  if (firstBundle.source.assurance !== 'USER_SUPPLIED_UNVERIFIED') {
    throw Error('Manual evidence assurance missing from bundle');
  }

  // A payload for a different identifier must be rejected.
  const secondId = 'audit-corr-2';
  await startManual(secondId);
  await evidence.fill(JSON.stringify(matchingPayload));
  await page.locator('#trace').click();
  await page.waitForFunction(() =>
    document.querySelector('#input-status')?.textContent.includes('does not contain the searched identifier')
  );

  // Correct the payload, then verify export from the corrected evidence.
  await evidence.fill(JSON.stringify({ ...matchingPayload, correlationId: secondId }));
  await page.locator('#trace').click();
  await page.waitForFunction(() =>
    document.querySelector('#input-status')?.textContent.includes('Provisional analysis')
  );
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#export').click()
  ]);
  if (!download.suggestedFilename().endsWith('.json')) {
    throw Error('Support evidence export missing');
  }

  // Preserve the captured-case contrast workflow and mobile fit.
  await page.locator('.fixture-buttons button:nth-child(2)').click();
  if (!(await page.locator('#classification').innerText()).includes('Refund')) {
    throw Error('F2 refund contrast failed');
  }
  await page.locator('.fixture-buttons button:nth-child(3)').click();
  if (!(await page.locator('#classification').innerText()).includes('Complete')) {
    throw Error('F3 success contrast failed');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) throw Error('Mobile horizontal overflow');
  return {
    matchingIdentifier: 'PASS',
    mismatchedIdentifierRejected: 'PASS',
    manualEvidenceAssurance: 'PASS',
    supportExport: 'PASS',
    F2: 'PASS',
    F3: 'PASS',
    mobileOverflow: false
  };
}
