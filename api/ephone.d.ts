declare module 'ephone' {
  export const roa: unknown;
  const createEphone: (pack: unknown) => Promise<{
    setVoice: (id: string) => void;
    textToIpaWithSourceMap: (text: string) => { ipa?: string };
  }>;
  export default createEphone;
}
