/**
 * @jest-environment jsdom
 */

const {
  addElementToDOM,
  handleFormSubmit,
  initializeDOMInteractions,
  removeElementFromDOM,
  simulateClick,
} = require('../index')

function setUpDOM() {
  document.body.innerHTML = `
    <h1>DOM Testing and User Behavior Simulation</h1>
    <button id="simulate-click">Simulate Click</button>
    <form id="user-form">
      <input type="text" id="user-input" placeholder="Enter text">
      <button type="submit">Submit</button>
    </form>
    <div id="dynamic-content"></div>
    <div id="error-message" class="hidden"></div>
  `
}

beforeEach(() => {
  setUpDOM()
})

describe('DOM helper functions', () => {
  test('adds content to the requested container', () => {
    addElementToDOM('dynamic-content', 'New content')

    expect(document.getElementById('dynamic-content').textContent).toBe('New content')
  })

  test('does nothing when the target container does not exist', () => {
    expect(() => addElementToDOM('missing-container', 'Content')).not.toThrow()
  })

  test('removes the requested element', () => {
    removeElementFromDOM('dynamic-content')

    expect(document.getElementById('dynamic-content')).toBeNull()
  })

  test('does nothing when the element to remove does not exist', () => {
    expect(() => removeElementFromDOM('missing-element')).not.toThrow()
  })

  test('simulateClick writes the button message to the DOM', () => {
    simulateClick('dynamic-content', 'Button Clicked!')

    expect(document.getElementById('dynamic-content').textContent).toBe('Button Clicked!')
  })
})

describe('form submission behavior', () => {
  test('writes trimmed input and hides the error message for valid input', () => {
    const input = document.getElementById('user-input')
    input.value = '  Hello DOM  '

    handleFormSubmit('user-form', 'dynamic-content')

    expect(document.getElementById('dynamic-content').textContent).toBe('Hello DOM')
    expect(document.getElementById('error-message').classList.contains('hidden')).toBe(true)
    expect(document.getElementById('error-message').textContent).toBe('')
  })

  test('shows an error and preserves content for empty input', () => {
    const dynamicContent = document.getElementById('dynamic-content')
    dynamicContent.textContent = 'Previous content'
    document.getElementById('user-input').value = '   '

    handleFormSubmit('user-form', 'dynamic-content')

    expect(dynamicContent.textContent).toBe('Previous content')
    expect(document.getElementById('error-message').textContent).toBe('Input cannot be empty')
    expect(document.getElementById('error-message').classList.contains('hidden')).toBe(false)
  })

  test('the click listener updates the DOM', () => {
    initializeDOMInteractions()

    document.getElementById('simulate-click').click()

    expect(document.getElementById('dynamic-content').textContent).toBe('Button Clicked!')
  })

  test('the submit listener prevents navigation and submits the form', () => {
    initializeDOMInteractions()
    document.getElementById('user-input').value = 'Submitted text'
    const form = document.getElementById('user-form')
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })

    form.dispatchEvent(submitEvent)

    expect(submitEvent.defaultPrevented).toBe(true)
    expect(document.getElementById('dynamic-content').textContent).toBe('Submitted text')
  })
})