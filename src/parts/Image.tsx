import { useStateContext } from '../utils/useStateObject';

// an image component that can add 'bw' class when enabled
export default function Image(props: any) {
  const [{ bwImages }] = useStateContext();
  props = { ...props };
  props.className = ((props.className || '') + (bwImages ? ' bw' : '')).trim();
  return <img {...props} />;
}