export const getAudienceScope = (role) => {
  if (role === 'patient') {
    return ['patients', 'all'];
  }
  if (role === 'counselor') {
    return ['counselors', 'all'];
  }
  return ['patients', 'counselors', 'all'];
};

export const updateReactionSummary = (summary = {}, oldType, newType) => {
  const result = {
    like: summary.like || 0,
    support: summary.support || 0,
    insight: summary.insight || 0,
    celebrate: summary.celebrate || 0
  };

  if (oldType && result[oldType] !== undefined) {
    result[oldType] = Math.max(result[oldType] - 1, 0);
  }

  if (newType && result[newType] !== undefined) {
    result[newType] += 1;
  }

  return result;
};

export const mapSessionStats = (stats = []) => stats.reduce((acc, stat) => {
  const activePatients = Array.isArray(stat.activePatientsSet) ? stat.activePatientsSet.length : 0;
  const completionRate = stat.totalSessions > 0
    ? Number(((stat.completedSessions / stat.totalSessions) * 100).toFixed(1))
    : 0;
  const averageSessionsPerPatient = activePatients > 0
    ? Number((stat.totalSessions / activePatients).toFixed(1))
    : 0;

  acc[stat._id.toString()] = {
    totalSessions: stat.totalSessions || 0,
    completedSessions: stat.completedSessions || 0,
    upcomingSessions: stat.upcomingSessions || 0,
    activePatients,
    completionRate,
    averageSessionsPerPatient
  };
  return acc;
}, {});

