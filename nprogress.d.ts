declare module 'nprogress' {
  const NProgress: {
    configure: (options: any) => void;
    start: () => void;
    done: (force?: boolean) => void;
    inc: (amount?: number) => void;
    set: (n: number) => void;
    remove: () => void;
    status: number | null;
  };
  export default NProgress;
}
