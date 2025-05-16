"use client";
import { Button } from "@/components/ui/button";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
} from "@clerk/nextjs";
import { Heart, Mail, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), { ssr: false });


type Props = {};

function Navbar({}: Props) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	return (
		<div className="px-4 md:px-10 pt-2 fixed w-full z-50">
			<div className="bg-[#171a1b]/85 backdrop-blur-md mx-auto h-20 border-b border-gray-500 text-white rounded-2xl">
				<div className="h-full px-5 flex items-center justify-between">
					<Link href="/dashboard">
						<div className="flex items-center text-3xl font-bold text-primary tracking-wider">
							<span className="inline-block w-9 h-9 bg-primary text-white font-extrabold text-center rounded-sm mr-1">
								V
							</span>
							ENZOR
						</div>
					</Link>

					{/* Desktop Nav */}
					<div className="hidden md:flex items-center flex-1 mx-10 space-x-6">
						<ul className="flex gap-3 text-sm font-semibold">
							<li>
								<Link href="/dashboard">
									<Button variant={"link"} className="text-zinc-200 border border-primary/0 hover:border-primary/80">Browse services</Button>
								</Link>
							</li>
							<li>
								<Link href="/dashboard">
									<Button variant={"link"} className="text-zinc-200 border border-primary/0 hover:border-primary/80">Become a vendor</Button>
								</Link>
							</li>
							<li>
								<Link href="/dashboard">
									<Button variant={"link"} className="text-zinc-200 border border-primary/0 hover:border-primary/80"> About us</Button>
								</Link>
							</li>
							<li>
								<Link href="/dashboard">
									<Button variant={"link"} className="text-zinc-200 border border-primary/0 hover:border-primary/80">Contact us</Button>
								</Link>
							</li>
						</ul>
					</div>

					<ul className="hidden md:flex items-center gap-6 text-sm font-semibold">
						<li>
							<div className="flex gap-2">
								<SignedIn>
									<UserButton />
								</SignedIn>
								<SignedOut>
									<SignInButton>
										<Button
											variant={"outline"}
											className="text-primary hover:text-primary border border-primary"
										>
											Sign In
										</Button>
									</SignInButton>
									<SignUpButton>
										<Button variant={"default"}>Sign Up</Button>
									</SignUpButton>
								</SignedOut>
							</div>
						</li>
					</ul>

					{/* Mobile Menu Toggle */}
					<div className="flex md:hidden">
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="text-primary focus:outline-none"
						>
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Nav */}
				{isMobileMenuOpen && (
					<div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
						<div className="absolute right-4 top-20 w-64 bg-[#171a1b] rounded-2xl p-4 shadow-lg border border-gray-700" onClick={e => e.stopPropagation()}>
							<ul className="space-y-2">
								<li>
									<Link href="/dashboard" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
										<Button variant="ghost" className="w-full justify-start px-4 py-2">Browse services</Button>
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
										<Button variant="ghost" className="w-full justify-start px-4 py-2">Become a vendor</Button>
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
										<Button variant="ghost" className="w-full justify-start px-4 py-2">About us</Button>
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
										<Button variant="ghost" className="w-full justify-start px-4 py-2">Contact us</Button>
									</Link>
								</li>
							</ul>

							<div className="mt-4 pt-4 border-t border-gray-700">
								<SignedIn>
									<div className="flex items-center justify-between w-full p-2">
										<span className="text-sm text-gray-300">Account</span>
										<UserButton />
									</div>
								</SignedIn>
								<SignedOut>
									<div className="space-y-2">
										<SignInButton>
											<Button 
												variant="outline" 
												className="w-full text-primary hover:text-primary border border-primary"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Sign In
											</Button>
										</SignInButton>
										<SignUpButton>
											<Button 
												variant="default" 
												className="w-full"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												Sign Up
											</Button>
										</SignUpButton>
									</div>
								</SignedOut>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Navbar;
