import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="">
      <div
        className=" absolute bg-cover bg-center h-screen w-full"
        style={{
          backgroundImage: "url('./images/signup.png')",
        }}
      ></div>
      <div className="flex items-center justify-center lg:justify-normal px-0 lg:px-30 h-screen">
        <SignUp />
      </div>
    </div>
  );
}
