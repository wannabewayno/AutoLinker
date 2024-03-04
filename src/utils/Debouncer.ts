// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackFunction = (...args: any[]) => void;

const Debouncer = (callback: CallbackFunction, timeout = 500): CallbackFunction => {
  let debounceTimer: NodeJS.Timeout | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => callback(...args), timeout);
  };
};

export default Debouncer;
