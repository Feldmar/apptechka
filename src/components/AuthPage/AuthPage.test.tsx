import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthPage } from './AuthPage';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../UI/StoneCheckbox/StoneCheckbox', () => ({
  __esModule: true,
  StoneCheckbox: ({
    onChange,
    text,
  }: {
    onChange: (checked: boolean) => void;
    text: string;
  }) => (
    <label>
      <input
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      {text}
    </label>
  ),
}));

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

const mockUseAuth = useAuth as jest.Mock;

describe('AuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
    });

    mockLogin.mockResolvedValue(undefined);
    mockRegister.mockResolvedValue(undefined);
  });

  it('renders the login form by default', () => {
    render(<AuthPage />);

    expect(screen.getByRole('tab', { name: 'Вход' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^пароль/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.getByText('Запомнить меня')).toBeInTheDocument();
  });

  it('switches to registration mode', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    await user.click(screen.getByRole('tab', { name: 'Регистрация' }));

    expect(screen.getByLabelText(/^подтверждение пароля/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /зарегистрироваться/i }),
    ).toBeInTheDocument();
  });

  it('shows an error when submitting an empty form', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates the email format', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    await user.type(screen.getByLabelText(/^email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/^пароль/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates the password requirements', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^пароль/i), 'weak');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows and hides the password', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    const passwordInput = screen.getByLabelText(/^пароль/i);

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /показать пароль/i }));

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /скрыть пароль/i }));

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls login with credentials and rememberMe', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^пароль/i), 'Password1!');

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!',
        rememberMe: true,
      });
    });
  });

  it('registers a user when passwords match', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);

    await user.click(screen.getByRole('tab', { name: 'Регистрация' }));

    await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^пароль/i), 'Password1!');
    await user.type(
      screen.getByLabelText(/^подтверждение пароля/i),
      'Password1!',
    );

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i }),
    );

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!',
      });
    });
  });

  it('does not register when passwords do not match', async () => {
    const user = userEvent.setup();

    render(<AuthPage />);

    await user.click(screen.getByRole('tab', { name: 'Регистрация' }));

    await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^пароль/i), 'Password1!');
    await user.type(
      screen.getByLabelText(/^подтверждение пароля/i),
      'Different1!',
    );

    await user.click(
      screen.getByRole('button', { name: /зарегистрироваться/i }),
    );

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('displays an API error when login fails', async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValueOnce(new Error('Неверный email или пароль'));

    render(<AuthPage />);

    await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^пароль/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(
      await screen.findByText('Неверный email или пароль'),
    ).toBeInTheDocument();
  });

  it('disables the submit button while login is pending', async () => {
    const user = userEvent.setup();

    let resolveLogin!: () => void;
    mockLogin.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        }),
    );

    render(<AuthPage />);

    await user.type(screen.getByLabelText(/^email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^пароль/i), 'Password1!');

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled();
    });

    await act(async () => {
      resolveLogin();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled();
    });
  });
});
