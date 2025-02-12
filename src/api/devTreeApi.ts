import { isAxiosError } from "axios";
import api from "../config/axios";
import { User, UserHandle } from "../types/user";

export async function getUser() {
  try {
    // TODO TYPE USER
    const { data } = await api<User>("/user");

    // console.log("data ->", data);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
  }
}

export async function updateProfile(formData: User) {
  try {
    // TODO TYPE USER
    const { data } = await api.patch<string>("/user", formData);

    // console.log("data ->", data);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function uploadImage(file: File) {
  const formData = new FormData();

  // TODO: LE DAMOS EL NOMBRE DE file pOR QUE ASI DIJIMOS EN EL BACK QUE SE LLAMARIA Y QUE ESO LEERIA
  formData.append("file", file);

  try {
    const {
      data: { image },
    } = await api.post<{ image: string }>("/user/image", formData);
    console.log(image);

    return image;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getUserByHandle(handle: string) {
  try {
    // TODO TYPE USER
    const { data } = await api<UserHandle>(`/${handle}`);

    console.log("data ->", data);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function searchByHandle(handle: string) {

  console.log('handle desde search ->', handle);
  
  try {
    const { data } = await api.post<string>("/search", {handle});

    console.log("data desde search by handle", data);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
