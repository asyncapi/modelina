import Button from "@/components/buttons/Button";
import GithubButton from "@/components/buttons/GithubButton";
import ModelinaLogo from "@/components/icons/ModelinaLogo";
import IconRocket from "@/components/icons/Rocket";

const Custom404 = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center p-8">
        <ModelinaLogo className="h-24 w-auto" />
        <h2 className="text-3xl font-bold mt-2">Page Not Found</h2>
        <p className="text-2xl text-center mt-2">The page you are looking for does not exist.</p>
        <div className="flex flex-col md:flex-row mt-4 gap-10">
          <GithubButton className="mt-4" href="https://github.com/asyncapi/modelina/issues/new/choose" text="Create an issue"/>
          <Button className="mt-4 font-semibold" href="/" text="Go to Home Page" icon={<IconRocket height='15px' width='15px'/>}/>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
