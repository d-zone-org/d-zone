import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'
import Comp from './Hello.svelte'

test('shows proper heading when rendered', () => {
  const { getByText } = render(Comp)

  expect(getByText('Hello World')).toBeInTheDocument()
})
