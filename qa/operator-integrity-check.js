async (page) => {
  const base = 'http://127.0.0.1:4174';
  await page.goto(base+'/?demo=F1');
  await page.getByRole('textbox', {name: /Explorer URL or transaction/}).fill('https://explorer.near-intents.org/transactions/0x2f3003AC7A8C8E54eb04abbA1Fd7cA5e4e1a5a32');
  await page.getByRole('button', {name:'Find captured case'}).click();
  if (!(await page.locator('#case-id').innerText()).includes('F2')) throw Error('F2 identifier route failed');
  if (!(await page.locator('#classification').innerText()).includes('Refund')) throw Error('F2 classification failed');
  await page.getByRole('textbox', {name:/Explorer URL or transaction/}).fill('unknown-case-123');
  await page.getByRole('button', {name:'Find captured case'}).click();
  if (!(await page.locator('#input-status').innerText()).includes('No captured evidence')) throw Error('Unknown case message missing');
  if (!(await page.locator('#result').evaluate(n=>n.classList.contains('hidden')))) throw Error('Stale diagnosis shown');
  await page.locator('.evidence-input').evaluate(n => n.open=true);
  await page.locator('#evidence').fill(JSON.stringify({reported_status:'REFUNDED',refund_evidence:['user assertion'],source_url:'https://example.org/reference',source_asset:'USDC'}));
  await page.locator('#trace').click();
  if (!(await page.locator('#confidence').innerText()).includes('Provisional')) throw Error('Unverified manual input falsely trusted');
  const bundle = JSON.parse(await page.locator('#preview').textContent());
  if (bundle.source.assurance !== 'USER_SUPPLIED_UNVERIFIED') throw Error('Bundle trust label missing');
  if (!bundle.escalation?.request || !bundle.unresolved_evidence) throw Error('Escalation incomplete');
  const [download] = await Promise.all([page.waitForEvent('download'),page.locator('#export').click()]);
  if (!download.suggestedFilename().endsWith('.json')) throw Error('Export missing');
  await page.setViewportSize({width:390,height:844});
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  if (overflow) throw Error('Mobile horizontal overflow');
  return {identifier:'PASS',unknown:'PASS',manual_provisional:'PASS',evidence_export:'PASS',mobile_overflow:false};
}