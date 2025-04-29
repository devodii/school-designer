export type Response<T> = { success: true; data: T } | { success: false; error: string }

export type OverrideProps<Base, Override> = Omit<Base, keyof Override> & Override
