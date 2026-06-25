import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  className?: string;
  backgroundImage?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
  backgroundImage,
}) => {
  return (
    <div
      className={`relative w-full pt-32 px-2 lg:px-20 py-4 bg-cover bg-center ${
        !backgroundImage ? 'bg-[#f95b33]' : ''
      }${className || ''}`}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {backgroundImage && <div className="absolute inset-0 bg-black/55" />}
      <div className="relative flex flex-col items-start pt-10 lg:items-center px-4 justify-center p-2 lg:p-10 py-10 w-full md:w-[80%] mx-auto">
        <h1 className="font-outfit text-white font-bold lg:text-5xl text-4xl normal-case">
          {title}
        </h1>
        {description ? (
          <p className="font-outfit font-light text-white lg:text-sm text-md lg:w-full lg:text-center w-full pt-4">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;
