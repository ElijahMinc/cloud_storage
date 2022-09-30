import { LANGUAGES, LocalStorageKeys } from "@/constant"
import {
  Box,
  HStack,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from "@chakra-ui/react"

// 1. Create a component that consumes the `useRadio` hook

interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode
}
const RadioCard: React.FC<RadioCardProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
interface RadioCardGroupProps {
  onChange: (value: LANGUAGES) => void
}
export const RadioCardGroup: React.FC<RadioCardGroupProps> = ({ onChange }) => {
  const options = [LANGUAGES.EN, LANGUAGES.UK]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "language",
    defaultValue:
      localStorage.getItem(LocalStorageKeys.LANGUAGE) ?? LANGUAGES.EN,
    onChange,
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}
