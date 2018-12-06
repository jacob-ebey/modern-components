import { UseStateArr } from "../useState";

export type UseTextInputArr = [string, (event: Event) => void];

export default function useTextInput(
  useState: UseStateArr<string>
): UseTextInputArr {
  const [value, setValue] = useState;

  return [
    value,
    (event: Event) => {
      setValue((event as any).target.value);
    }
  ];
}
