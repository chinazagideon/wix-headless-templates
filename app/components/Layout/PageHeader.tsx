import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div
      className={`w-full bg-[#D9D9D9] pt-32 px-2 lg:px-20 py-10 ${
        className || ''
      }`}
    >
      <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
        <h1 className="font-outfit font-thin lg:text-7xl text-4xl text-black normal-case">
          {title}
        </h1>
        {description ? (
          <p className="font-outfit font-thin lg:text-sm text-xs text-black lg:w-[70%] w-full pt-4">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;
