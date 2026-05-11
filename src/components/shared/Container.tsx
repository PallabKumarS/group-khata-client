interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-[95%] mt-4 text-center ${className}`}>
      {children}
    </div>
  );
};

export default Container;
