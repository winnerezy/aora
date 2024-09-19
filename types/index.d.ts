export type User = {
    userid: string
    email: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    photo: string;
}

type Message = {
    id: string
    role: string
    part: string
}