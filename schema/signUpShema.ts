import * as z from 'zod';

export const signUpFormSchema = z.object({
   email: z.string().email('Please enter a valid email'),
  password: z.string().min(10, 'password must be at least 10 characters'),
  confirmPassword: z.string().min(10, 'password must be at least 10 characters'),
  username: z.string().min(3, 'name must be at least 3 characters'),
    
  });
  

  export type SignUpFormSchema = z.infer<typeof signUpFormSchema>