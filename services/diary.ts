import axios from "axios";

const apiUrl = "http://192.168.219.48:8000/diary";

export type Diary = {
  id?: string | undefined;
  title: string | undefined;
  description: string | undefined;
  date: string | undefined;
};

export async function createDiary(diary: Diary) {
  try {
    await axios.post(apiUrl, diary);
  } catch (error) {
    console.error("Diary Create Error!!!", error);
  }
}

export async function getDiary() {
  try {
    const res = await axios.get(`${apiUrl}`);
    return res.data;
  } catch (error) {
    console.error("Diary List Error!!!", error);
  }
}

export async function getDiaryOne(id: string) {
  try {
    const res = await axios.get(`${apiUrl}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Diary get Id Error!!!", error);
  }
}

export async function updateDiary(id: string, diary: Diary) {
  try {
    await axios.put(`${apiUrl}/${id}`, diary);
  } catch (error) {
    console.error("Diary Update Error!!!", error);
  }
}

export async function deleteDiary(id: string) {
  try {
    await axios.delete(`${apiUrl}/${id}`);
  } catch (error) {
    console.error("Diary Delete Error!!!", error);
  }
}
