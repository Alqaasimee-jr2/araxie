export const FAKE_AVATARS = {
  abdullah: '/avatars/abdullah.svg',
  sarah: '/avatars/sarah.svg',
  priya: '/avatars/priya.svg',
  marcus: '/avatars/marcus.svg',
  david: '/avatars/david.svg',
  amina: '/avatars/amina.svg',
  alex: '/avatars/alex.svg',
  elena: '/avatars/elena.svg',
  judge: '/avatars/judge.svg',
  creator: '/avatars/creator.svg',
  default: '/avatars/default.svg',
} as const;

export function getFakeAvatar(nameOrKey?: string): string {
  if (!nameOrKey) return FAKE_AVATARS.default;
  const lower = nameOrKey.toLowerCase();
  
  if (lower.includes('abdullah') || lower.includes('falade') || lower.includes('qaasim') || lower.includes('alqaasimee')) {
    return FAKE_AVATARS.abdullah;
  }
  if (lower.includes('sarah')) return FAKE_AVATARS.sarah;
  if (lower.includes('priya')) return FAKE_AVATARS.priya;
  if (lower.includes('marcus')) return FAKE_AVATARS.marcus;
  if (lower.includes('david')) return FAKE_AVATARS.david;
  if (lower.includes('amina')) return FAKE_AVATARS.amina;
  if (lower.includes('elena') || lower.includes('rostova')) return FAKE_AVATARS.elena;
  if (lower.includes('judge') || lower.includes('evaluator') || lower.includes('alex chen')) return FAKE_AVATARS.judge;
  if (lower.includes('alex')) return FAKE_AVATARS.alex;
  if (lower.includes('creator') || lower.includes('builder')) return FAKE_AVATARS.creator;

  // Deterministic mapping by string hash
  const keys: Array<keyof typeof FAKE_AVATARS> = [
    'abdullah', 'sarah', 'priya', 'marcus', 'david', 'amina', 'alex', 'elena', 'creator'
  ];
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % keys.length;
  return FAKE_AVATARS[keys[index]] || FAKE_AVATARS.default;
}
