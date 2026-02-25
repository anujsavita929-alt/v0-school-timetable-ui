'use client';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string): { level: 'weak' | 'fair' | 'good' | 'strong'; score: number } => {
    let score = 0;

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;

    // Lowercase letters
    if (/[a-z]/.test(pwd)) score += 1;

    // Uppercase letters
    if (/[A-Z]/.test(pwd)) score += 1;

    // Numbers
    if (/[0-9]/.test(pwd)) score += 1;

    // Special characters
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { level: 'weak', score };
    if (score <= 3) return { level: 'fair', score };
    if (score <= 4) return { level: 'good', score };
    return { level: 'strong', score };
  };

  if (!password) return null;

  const { level, score } = calculateStrength(password);
  const maxScore = 6;

  const getColor = () => {
    switch (level) {
      case 'weak':
        return '#E74C3C';
      case 'fair':
        return '#F39C12';
      case 'good':
        return '#27AE60';
      case 'strong':
        return '#27AE60';
      default:
        return '#E74C3C';
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'weak':
        return 'Weak password';
      case 'fair':
        return 'Fair password';
      case 'good':
        return 'Good password';
      case 'strong':
        return 'Strong password';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bars */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full bg-gray-200 transition-all"
            style={{
              backgroundColor: i < score ? getColor() : '#E5E7EB',
            }}
          ></div>
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: getColor() }}>
          {getLabel()}
        </p>
        <p className="text-xs text-gray-600">
          {score}/{maxScore} criteria met
        </p>
      </div>
    </div>
  );
}
