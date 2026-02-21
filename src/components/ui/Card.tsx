import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function Card({ children, title, ...props }: CardProps) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden" {...props}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}
