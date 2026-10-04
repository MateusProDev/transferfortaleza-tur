interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  return (
    <div className="text-4xl font-bold text-primary-900 mb-2" aria-label={`${target}${suffix}`}>
      {prefix}{target.toLocaleString()}{suffix}
    </div>
  );
}
