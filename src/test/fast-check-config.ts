import * as fc from 'fast-check';

/**
 * Shared fast-check configuration for Nocturneum Core property-based tests.
 * - Minimum 100 iterations per property test
 * - Shrinking enabled for minimal failing examples
 * - Configurable seed for reproducibility
 */
export const defaultPbtConfig = {
  numRuns: 100,
  verbose: true,
};

/**
 * Helper to run property-based tests with Nocturneum default parameters.
 */
export function assertProperty<T>(
  property: fc.IProperty<T>,
  params?: fc.Parameters<T>
): void {
  fc.assert(property, {
    ...defaultPbtConfig,
    ...params,
  });
}
