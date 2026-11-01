import { SavedPlanState } from '../types/storage';
import { calculateGrowthPulse } from '../features/dashboard/growthPulseCalculations';

export interface WeeklyDigestContent {
  subject: string;
  previewText: string;
  markdownContent: string;
  htmlContent: string;
  topTasks: Array<{
    title: string;
    category: string;
    priority: string;
    estimatedEffort: string;
    instructions: string[];
    suggestedNextStep: string;
  }>;
  stats: {
    totalTasks: number;
    completedTasks: number;
    remainingTasks: number;
    completionPercentage: number;
    readinessScore: number;
    momentumLabel: string;
  };
}

/**
 * Builds a weekly digest summarizing remaining tasks and upcoming priorities.
 */
export function generateWeeklyDigest(plan: SavedPlanState): WeeklyDigestContent {
  const businessName = plan.answers.businessName?.trim() || 'Your Local Business';
  const location = [plan.answers.cityArea, plan.answers.country].filter(Boolean).join(', ');
  const pulse = calculateGrowthPulse(plan.tasks);

  // Incomplete tasks ordered by priority
  const incompleteTasks = plan.tasks.filter((t) => t.status !== 'completed');
  const highPriority = incompleteTasks.filter((t) => t.priority === 'High');
  const mediumPriority = incompleteTasks.filter((t) => t.priority === 'Medium');
  const lowPriority = incompleteTasks.filter((t) => t.priority === 'Low');

  // Top 3 priority focus tasks for this week
  const topTasks = [...highPriority, ...mediumPriority, ...lowPriority].slice(0, 3).map((t) => ({
    title: t.title,
    category: t.category,
    priority: t.priority,
    estimatedEffort: t.estimatedEffort,
    instructions: t.instructions,
    suggestedNextStep: t.suggestedNextStep,
  }));

  const stats = {
    totalTasks: plan.tasks.length,
    completedTasks: pulse.completedTasks,
    remainingTasks: incompleteTasks.length,
    completionPercentage: pulse.overallPercentage,
    readinessScore: plan.scoreResult.totalScore,
    momentumLabel: pulse.momentumLabel,
  };

  const subject = `[TapGrow] ${businessName} – ${stats.remainingTasks} Actions Remaining (${stats.completionPercentage}% Complete)`;
  const previewText = `Your weekly marketing priorities: ${topTasks.length > 0 ? topTasks[0].title : 'All actions completed!'}`;

  // Markdown format for text emails or clipboard
  const markdownLines = [
    `# 🚀 TapGrow Weekly Marketing Digest · Plan • Improve • Grow`,
    `**Business:** ${businessName}${location ? ` (${location})` : ''}`,
    `**Overall Momentum:** ${stats.completionPercentage}% Complete · ${stats.momentumLabel}`,
    `**Readiness Score:** ${stats.readinessScore}/100`,
    `**Completed:** ${stats.completedTasks} of ${stats.totalTasks} tasks`,
    '',
    `## 🎯 This Week's Priority Focus Actions`,
  ];

  if (topTasks.length === 0) {
    markdownLines.push(
      '🎉 All recommended marketing tasks are currently complete! Great job maintaining local consistency.'
    );
  } else {
    topTasks.forEach((t, i) => {
      markdownLines.push(`### ${i + 1}. ${t.title} [${t.priority} Priority · ${t.category}]`);
      markdownLines.push(`- **Estimated Time:** ${t.estimatedEffort}`);
      markdownLines.push(`- **Key Steps:**`);
      t.instructions.slice(0, 3).forEach((inst) => {
        markdownLines.push(`  • ${inst}`);
      });
      if (t.suggestedNextStep) {
        markdownLines.push(`- **Immediate Next Step:** ${t.suggestedNextStep}`);
      }
      markdownLines.push('');
    });
  }

  markdownLines.push('## 📊 Category Progress');
  pulse.categories.forEach((cat) => {
    markdownLines.push(`- **${cat.category}:** ${cat.completed}/${cat.total} done (${cat.percentage}%)`);
  });

  markdownLines.push('');
  markdownLines.push('Keep this momentum going: consistent 15-minute weekly marketing actions produce compounding local customer discovery.');

  const markdownContent = markdownLines.join('\n');

  // HTML format for rich preview
  const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.5;">
  <div style="background-color: #16866f; color: #ffffff; padding: 24px; border-radius: 12px 12px 0 0;">
    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; margin-bottom: 4px;">Weekly Growth Digest</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 800;">${businessName}</h1>
    <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">${location ? `${location} · ` : ''}Readiness Score: ${stats.readinessScore}/100 · ${stats.momentumLabel}</p>
  </div>
  
  <div style="padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px; display: flex; justify-content: space-between;">
      <div>
        <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Growth Momentum</div>
        <div style="font-size: 20px; font-weight: 800; color: #0f172a;">${stats.completionPercentage}% <span style="font-size: 13px; font-weight: 400; color: #64748b;">(${stats.completedTasks}/${stats.totalTasks} done)</span></div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Remaining</div>
        <div style="font-size: 20px; font-weight: 800; color: #16866f;">${stats.remainingTasks} <span style="font-size: 13px; font-weight: 400; color: #64748b;">actions</span></div>
      </div>
    </div>

    <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">
      This Week's Priority Actions
    </h2>

    ${
      topTasks.length === 0
        ? '<p style="color: #64748b; font-size: 14px;">All recommended marketing actions are completed!</p>'
        : topTasks
            .map(
              (t, idx) => `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px; background: #fafafa;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="background: #fee2e2; color: #991b1b; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">#${idx + 1} ${t.priority} Priority</span>
          <span style="font-size: 11px; color: #64748b;">Est. ${t.estimatedEffort}</span>
        </div>
        <h3 style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #0f172a;">${t.title}</h3>
        <p style="margin: 0 0 8px; font-size: 12px; color: #475569;"><strong>Next step:</strong> ${t.suggestedNextStep}</p>
      </div>`
            )
            .join('')
    }

    <h2 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 20px; margin-bottom: 10px;">
      Category Momentum
    </h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px;">
      ${pulse.categories
        .map(
          (c) => `
        <div style="border: 1px solid #f1f5f9; background: #f8fafc; border-radius: 6px; padding: 8px 10px; font-size: 12px;">
          <div style="font-weight: 600; color: #334155; margin-bottom: 2px;">${c.category}</div>
          <div style="color: #16866f; font-weight: 700;">${c.percentage}% <span style="font-weight: 400; color: #64748b; font-size: 11px;">(${c.completed}/${c.total})</span></div>
        </div>`
        )
        .join('')}
    </div>

    <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
      Generated by TapGrow · Plan • Improve • Grow · Secure client-side local data
    </div>
  </div>
</div>
  `.trim();

  return {
    subject,
    previewText,
    markdownContent,
    htmlContent,
    topTasks,
    stats,
  };
}

/**
 * Creates a mailto link so the user can send their current weekly digest to any email client.
 */
export function createMailtoLink(toEmail: string, digest: WeeklyDigestContent): string {
  const subject = encodeURIComponent(digest.subject);
  const body = encodeURIComponent(digest.markdownContent);
  return `mailto:${encodeURIComponent(toEmail)}?subject=${subject}&body=${body}`;
}
