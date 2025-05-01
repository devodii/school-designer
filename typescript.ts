export type Response<T> = { success: true; data: T } | { success: false; error: string }

export type OverrideProps<Base, Extend> = Extend & Omit<Base, keyof Extend>
