import * as lucide from 'lucide-react';
const wanted = ['ArrowRight','CheckCircle','RefreshCw','Zap','Settings','Lightbulb','Eye','EyeOff','Shuffle','Trophy','Sparkles','Loader','X'];
const keys = Object.keys(lucide);
console.log('Total exports:', keys.length);
console.log('Available wanted icons:', keys.filter(k => wanted.includes(k)));
console.log('Sample exports (first 120):', keys.slice(0,120));
