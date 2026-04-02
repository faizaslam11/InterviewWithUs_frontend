/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode to prevent double-invocation of effects/handlers in dev.
  // Strict Mode causes the form submit to fire twice, creating two Razorpay orders
  // within milliseconds which triggers "Too many requests" (BAD_REQUEST_ERROR).
  // This does NOT affect production behaviour.
  reactStrictMode: false,
};

module.exports = nextConfig;
