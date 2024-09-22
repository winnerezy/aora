/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/a/**",
                port: ""
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                pathname: "/u/**",
                port: ""
            }
        ]
    },
};

export default nextConfig;
