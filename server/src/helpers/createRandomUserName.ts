import User from "../models/user";

export default async function createRandomUserName(
  name: string
): Promise<string> {
  let userName = name.replaceAll(" ", "");
  console.log("userName", userName);

  if (userName.length > 10) {
    userName = userName.slice(0, 10);
  }

  userName += randomIntFromInterval(
    10 ** (14 - userName.length),
    10 ** (15 - userName.length)
  );

  const user = await User.findOne({ userName });
  if (user) {
    await createRandomUserName(userName);
  }

  return userName;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
