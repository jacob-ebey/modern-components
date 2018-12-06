import { UseStateArr } from "../useState";

export type UseTextInputArr = [number, (event: Event) => void];

export default function useIntegerInput(
  useState: UseStateArr<number>
): UseTextInputArr {
  const [value, setValue] = useState;

  return [
    value,
    (event: Event) => {
      setValue(Number.parseInt((event as any).target.value, 10));
    }
  ];
}
