export const SocketRooms = {
  PROVIDER: 'PROVIDER',
  ACCOUNT: 'ACCOUNT',
} as const;
export type SocketRooms = (typeof SocketRooms)[keyof typeof SocketRooms];

export function roomFormatter(roomType: string, id: string): string {
  return `${roomType}:${id}`;
}
