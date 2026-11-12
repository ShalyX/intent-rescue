export function unresolvedEvidenceMessage(stage, index, sourceSnapshot) {
  const kind = index === 3 ? 'destination' : index === 4 ? 'refund' : null;
  if (!kind) return 'The supplied evidence does not resolve this leg';
  if (!Array.isArray(stage?.evidence) || stage.evidence.length === 0) {
    return `No ${kind} transaction or receipt is present in this evidence set`;
  }
  if (sourceSnapshot) {
    return kind === 'destination'
      ? 'Destination evidence is source-reported; verify the transaction and receipt in the destination wallet.'
      : 'Refund evidence is source-reported; verify the transaction and returned funds in your wallet.';
  }
  return `Supplied ${kind} evidence is provisional; confirm it against the original chain source.`;
}
