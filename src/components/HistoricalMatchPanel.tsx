import { ExternalLink } from "lucide-react";
import type { MatchResult } from "../types";

export function HistoricalMatchPanel({ matches }: { matches: MatchResult[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Historical Match Engine</p>
          <h2 className="mt-2 text-2xl font-semibold text-bone">Closest Matches</h2>
        </div>
        <span className="text-sm text-muted">{matches.length} shown</span>
      </div>
      <div className="overflow-hidden rounded-md border border-white/10">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Actuals</th>
              <th className="px-4 py-3">Matched</th>
              <th className="px-4 py-3">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {matches.map((match) => (
              <tr key={match.id} className="bg-black/10 align-top">
                <td className="px-4 py-4">
                  <div className="font-semibold text-bone">{match.projectName}</div>
                  <div className="mt-1 text-xs text-muted">{match.projectType}</div>
                  {match.referenceLink ? (
                    <a
                      href={match.referenceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-clear hover:underline"
                    >
                      Reference <ExternalLink size={12} />
                    </a>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <div className="text-2xl font-semibold text-bone">{match.matchScore}</div>
                  <div className="mt-1 text-xs text-muted">{match.matchTier}</div>
                  <div className="mt-1 text-xs text-muted">{match.confidenceLevel}</div>
                </td>
                <td className="px-4 py-4 text-muted">
                  <div>{match.actualTimelineDays} days</div>
                  <div>{match.actualHours} hours</div>
                  <div>{match.revisionRounds} revisions</div>
                  <div>{match.finalComplexityTier}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedVariables.map((variable) => (
                      <span key={variable} className="rounded-full border border-clear/30 bg-clear/10 px-2 py-1 text-xs text-clear">
                        {variable}
                      </span>
                    ))}
                  </div>
                  {match.mismatchedVariables.length ? (
                    <div className="mt-2 text-xs leading-5 text-muted">{match.mismatchedVariables.join("; ")}</div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-sm leading-6 text-bone">{match.reuseRecommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
