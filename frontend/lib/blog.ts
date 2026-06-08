// Совместимость: данные блога теперь приходят из API (см. lib/site.ts).
export { defaultPosts as posts, formatDate } from './defaults';
export type { PostItem as Post, Block } from './defaults';
