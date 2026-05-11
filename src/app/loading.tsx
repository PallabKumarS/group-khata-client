import { PageLoader } from "@/components/shared/Loaders";

const loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <PageLoader />
    </div>
  );
};

export default loading;
