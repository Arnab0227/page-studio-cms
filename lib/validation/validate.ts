import { BuilderComponentSchema, PageModelSchema } from '@/lib/schema';
import type { BuilderComponent, PageModel } from '@/lib/schema';


export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export function validateComponent(data: unknown): ValidationResult<BuilderComponent> {
  const result = BuilderComponentSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.flatten().fieldErrors;
  const errorMessage = result.error.errors[0]?.message || 'Invalid component';

  return {
    success: false,
    error: errorMessage,
    errors: errors as Record<string, string>,
  };
}


export function validateComponents(
  data: unknown
): ValidationResult<BuilderComponent[]> {
  if (!Array.isArray(data)) {
    return { success: false, error: 'Components must be an array' };
  }

  const validated: BuilderComponent[] = [];
  const errors: Record<number, string> = {};

  for (let i = 0; i < data.length; i++) {
    const result = validateComponent(data[i]);
    if (result.success && result.data) {
      validated.push(result.data);
    } else {
      errors[i] = result.error || 'Invalid component';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: `${Object.keys(errors).length} component(s) failed validation`,
      errors,
    };
  }

  return { success: true, data: validated };
}


export function validatePage(data: unknown): ValidationResult<PageModel> {
  const result = PageModelSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.flatten().fieldErrors;
  const errorMessage = result.error.errors[0]?.message || 'Invalid page';

  return {
    success: false,
    error: errorMessage,
    errors: errors as Record<string, string>,
  };
}

export function safeParse<T>(
  validator: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: any } },
  data: unknown
): { success: boolean; data?: T; error?: string } {
  try {
    const result = validator.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error?.message || 'Validation failed' };
  } catch (error) {
    console.error('[Validation] Parse error:', error);
    return { success: false, error: 'Unexpected validation error' };
  }
}
