interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={`mx-auto w-full max-w-[95%] pb-10 text-center pt-20 md:pt-16 min-h-[calc(100vh-8rem)] space-y-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
