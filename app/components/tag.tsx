'use client';
import * as crypto from 'crypto'

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ( { text } ) => {
  const hash = crypto.createHash('md5').update(text).digest('hex');

  const darkFactor = 200;
  const r = parseInt(hash.substr(0, 2), 16) % darkFactor;
  const g = parseInt(hash.substr(2, 2), 16) % darkFactor;
  const b = parseInt(hash.substr(4, 2), 16) % darkFactor;

  const darkColor = `rgb(${r}, ${g}, ${b})`;
  const darkerColor = `rgb(${r * 0.75}, ${g * 0.75}, ${b * 0.75})`;

  const style = {backgroundColor: darkColor, borderColor: darkerColor, };
  return (
    <span
      className="text-xs font-bold bg-pink-600 border-pink-700 p-1 border-2 border-solid text-white rounded-lg"
      style={style}
      >
      {text}
    </span>
  )
};

export default Tag;
