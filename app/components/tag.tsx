'use client';

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ( { text } ) => {
  return (
    <span className="text-xs font-bold p-1 bg-pink-700 border-2 border-pink-900 border-solid text-white rounded-lg">
      {text}
    </span>
  )
};

export default Tag;
