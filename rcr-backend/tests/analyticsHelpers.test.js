import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAudienceScope,
  updateReactionSummary,
  mapSessionStats
} from '../utils/analyticsHelpers.js';

test('getAudienceScope returns audiences based on role', () => {
  assert.deepEqual(getAudienceScope('patient'), ['patients', 'all']);
  assert.deepEqual(getAudienceScope('counselor'), ['counselors', 'all']);
  assert.deepEqual(getAudienceScope('admin'), ['patients', 'counselors', 'all']);
});

test('updateReactionSummary increments and decrements reactions safely', () => {
  const baseSummary = { like: 1, support: 0, insight: 0, celebrate: 0 };

  const increased = updateReactionSummary(baseSummary, null, 'support');
  assert.equal(increased.support, 1);
  assert.equal(increased.like, 1);

  const switched = updateReactionSummary(increased, 'support', 'insight');
  assert.equal(switched.support, 0);
  assert.equal(switched.insight, 1);

  const removed = updateReactionSummary(switched, 'insight', null);
  assert.equal(removed.insight, 0);
});

test('mapSessionStats calculates key metrics for counsellors', () => {
  const stats = [
    {
      _id: 'abc',
      totalSessions: 10,
      completedSessions: 8,
      upcomingSessions: 2,
      activePatientsSet: ['p1', 'p2', 'p3']
    }
  ];

  const result = mapSessionStats(stats);
  assert.equal(result.abc.totalSessions, 10);
  assert.equal(result.abc.completedSessions, 8);
  assert.equal(result.abc.upcomingSessions, 2);
  assert.equal(result.abc.activePatients, 3);
  assert.equal(result.abc.completionRate, 80);
  assert.equal(result.abc.averageSessionsPerPatient, Number((10 / 3).toFixed(1)));
});

