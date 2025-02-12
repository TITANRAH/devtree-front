// TODO: INTERFACES Y PICK

// CREO UN TYPE
export type User = {
  handle: string;
  name: string;
  email: string;
  _id: string;
  description: string;
  image: string;
  links: string;
};

export type UserHandle = Pick<User, 'description'| 'handle'|'image'|'links'|'name'>

// CREO OTRO TYOPE USANDO PICK PARA TOMAR CIERTAS COSAS DEL TYPE CREADO
export type RegisterForm = Pick<User, "handle" | "email" | "name"> & {
  password: string;
  password_confirmation: string;
};

export type LoginForm = Pick<User, "email"> & {
  password: string;
};

// TODO: TYPES HIJOS CADA VEZ QUE NECSITE USER
export type ProfileForm = Pick<User, "description" | "handle">;




export type SocialNetwork = {
  id: number,
  name: string,
  url: string,
  enabled: boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'name'| 'url'| 'enabled'>
