"use client";
import React, { useState, useEffect } from "react";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "../../../../../lib/supabase-client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Proposal, User } from "@/app/types";

interface MilestoneProps {
	index: string;
}

interface SelectOption {
	value: string;
	label: string;
}

export default function WriteProposal() {
	const { user, authenticated, ready } = usePrivy();
	const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const router = useRouter();
	const {
		register,
		formState,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm<Proposal>({
		mode: "onBlur",
		defaultValues: {
			title: '',
			location: '',
			description: '',
			affected_locations: '',
			minimum_budget: undefined,
			key_players: '',
			timeline: ''
		}
	});
	const { isValid } = formState;
	const [rows, setRows] = useState([{ key: "default" }]);
	const [currentStep, setCurrentStep] = useState(1);
	const t = useTranslations("Create Proposal");
	useEffect(() => {
		getUsers();
	}, []);

	useEffect(() => {
		let options: SelectOption[] = [];
		users.forEach((user) => {
			let userOption = {
				value: user.id,
				label: user.name + " " + user.family_name,
			};
			options.push(userOption);
		});
		setUserOptions([...userOptions, ...options]);
	}, [users]);
	if (!ready) return null;
	if (ready && !authenticated) {
		router.push("/");
	}

	async function getUsers() {
		const { data } = await supabase.from("users").select();
		if (data) setUsers(data);
	}

	const selectUser = (user: SelectValue) => {
		if (user)
			setUserOptions((current) =>
				// @ts-ignore
				current.filter((option) => option.value !== user.value)
			);
		setSelectedUsers([...selectedUsers, user]);
	};

	const removeCollaborator = (user: SelectValue) => {
		setSelectedUsers((current) =>
			// @ts-ignore
			current.filter((option) => option.value !== user.value)
		);
		// @ts-ignore
		setUserOptions([...userOptions, user]);
	};

	const onSubmit: SubmitHandler<Proposal> = async (formData) => {
		try {
			const { data: proposalData, error: proposalError } = await supabase
				.from("proposals")
				.insert({
					author_id: user?.id,
					title: formData.title,
					description: formData.description,
					timeline: formData.timeline,
					location: formData.location,
					affected_locations: formData.affected_locations,
					community_problem: formData.community_problem,
					proposed_solution: formData.proposed_solution,
					minimum_budget: formData.minimum_budget,
					key_players: formData.key_players,
				})
				.select();
			if (proposalError) {
				throw proposalError;
			}
			const { error } = await supabase.from("proposal_collaborators").insert({
				//proposal_id: proposalData.id, this TS error is back
				collaborator_id: user?.id,
			});
			if (error) {
				throw error;
			}
			router.push(`/proposals/`);
		} catch (error) {
			console.log(error);
		}
	};
	const inputClasses = "w-full border border-slate-300 rounded h-10 pl-2 mb-6";
	const textareaClasses =
		"w-full border border-slate-300 rounded h-20 pl-2 mb-6";

	function removeRow(index: string) {
		if (index !== "default")
			setRows((current) => current.filter((_) => _.key !== index));
	}

	function setStep(direction: string) {
		if (direction === "next") {
			setCurrentStep(currentStep + 1);
		}
		if (direction === "previous") {
			setCurrentStep(currentStep - 1);
		}
	}

	const StepControls = () => {
		return (
			<div className="flex mb-10 mt-10">
				{currentStep !== 1 && (
					<button
						className="border border-slate-400 rounded leading-10 font-bold px-10"
						onClick={() => setStep("previous")}
					>
						{t("previousButton")}
					</button>
				)}

				{currentStep !== 6 && (
					<button
						className="border border-slate-400 rounded leading-10 font-bold px-10 ml-auto disabled:opacity-50"
						onClick={() => {
							setStep("next")
						}}
						disabled={isValid?false:true}
					>
						{t("nextButton")}
					</button>
				)}
			</div>
		);
	};

	const MilestoneRow = ({ index, ...props }: MilestoneProps) => {
		return (
			<div className="flex mb-2">
				<input
					{
					// @ts-ignore
					...register(`milestones.${index}.title`)
					}
					className="w-1/2 border border-slate-300 rounded h-10 pl-2 mb-2"
					placeholder="Title"
				/>
				{index !== "default" && (
					<input
						{
						// @ts-ignore
						...register(`milestones.${index}.budget`)
						}
						className="w-2/5 border border-slate-300 rounded h-10 pl-2 mb-2 ml-2"
						placeholder="Budget"
					/>
				)}
				{index === "default" && (
					<input
						{
						// @ts-ignore
						...register(`milestones.${index}.budget`)
						}
						className="w-1/2 border border-slate-300 rounded h-10 pl-2 mb-2 ml-2"
						placeholder="Budget"
					/>
				)}
				{index !== "default" && (
					<XMarkIcon
						onClick={() => removeRow(index)}
						className="h-6 ml-2 mt-2.5"
					/>
				)}
			</div>
		);
	};

	function addRow() {
		const key = "milestone-" + (rows.length + 2);
		setRows([...rows, { key }]);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{currentStep === 1 && (
				<>
					<h3 className="font-bold mb-6">{t("heading1")}</h3>
					<span className="text-red-600 text-xs"> {errors.title && errors.title.message}</span>
					<input
						className={inputClasses}
						placeholder="Title"
						{...register("title", { required: "Please enter Proposal Title." })}
					/>
					<span className="text-red-600 text-xs"> {errors.location && errors.location.message}</span>
					<input
						className={inputClasses}
						placeholder={t("location")}
						{...register("location", { required: "Please enter project location." })}
					/>
					<h3 className="font-bold mb-6">{t("addCollaborators")}</h3>
					{selectedUsers.length > 0 &&
						selectedUsers.map((user) => (
							<div
								key={user}
								className="border border-slate-400 rounded leading-8 text-xs px-2 font-bold inline-block mb-3"
							>
								<input type="hidden" value={selectedUsers} />
								<div className="flex">
									{user?.label}
									<XMarkIcon
										onClick={() => removeCollaborator(user)}
										className="h-3 ml-2 mt-2.5 cursor-pointer"
									/>
								</div>
							</div>
						))}
					{userOptions.length > 0 && (
						<Select
							primaryColor={"blue"}
							onChange={selectUser}
							value={null}
							isSearchable={true}
							placeholder="Select Collaborators"
							options={userOptions}
						/>
					)}

					<StepControls />
				</>
			)}
			{currentStep === 2 && (
				<>
					<h3 className="font-bold mb-6">{t("heading2")}</h3>
					<span className="text-red-600 text-xs"> {errors.description && errors.description.message}</span>
					<textarea
						className={textareaClasses}
						placeholder={t("descriptionPlaceholder")}
						{...register("description", { required: "Please provide description." })}
					/>
					<span className="text-red-600 text-xs"> {errors.affected_locations && errors.affected_locations.message}</span>
					<input
						className={inputClasses}
						placeholder={t("locationsAffectedPlaceholder")}
						{...register("affected_locations", { required: "Please provide affected locations." })}
					/>
					<StepControls />
				</>
			)}
			{currentStep === 3 && (
				<>
					<h3 className="font-bold mb-6">{t("heading3")}</h3>
					<textarea
						className={textareaClasses}
						placeholder={t("communityProblemPlaceholder")}
						{...register("community_problem", { required: "Please provide community problem." })}
					/>
					<p className="text-sm center italic">
						{t("communityProblemContext")}
					</p>
					<StepControls />
				</>
			)}
			{currentStep === 4 && (
				<>
					<h3 className="font-bold mb-6">{t("heading4")}</h3>
					<textarea
						className={textareaClasses}
						placeholder={t("proposedSolutionPlaceholder")}
						{...register("proposed_solution", { required: "Please provide proposed solution." })}
					/>
					<p className="text-sm center italic">
						{t("proposedSolutionContext")}
					</p>
					<StepControls />
				</>
			)}
			{currentStep === 5 && (
				<>
					<h3 className="font-bold mb-6">{t("heading5")}</h3>
					<input
						className={inputClasses}
						placeholder={t("minimumBudgetPlaceholder")}
						{...register("minimum_budget", { required: "Please provide minimum budget." })}
					/>
					<input
						className={inputClasses}
						placeholder={t("keyPlayersPlaceholder")}
						{...register("key_players", { required: "Please provide key players." })}
					/>
					<input
						className={inputClasses}
						placeholder={t("timelinePlaceholder")}
						{...register("timeline", { required: "Please provide timeline." })}
					/>
					<StepControls />
				</>
			)}
			{currentStep === 6 && (
				<>
					<h3 className="font-bold mb-6">{t("heading6")}</h3>
					{rows.map((row, index) => (
						<MilestoneRow key={row.key} index={row.key} />
					))}
					<p
						className="text-right underline mb-8 text-sky-600 mt-2"
						onClick={addRow}
					>
						{t("addMilestoneButton")}
					</p>
					<p
						className="underline mb-8 text-sky-600"
						onClick={() => setStep("previous")}
					>
						{t("previousButton")}
					</p>
					<button
						className="w-full border border-slate-400 rounded leading-10 font-bold"
						type="submit"
					>
						{t("submitButton")}
					</button>
				</>
			)}
		</form>
	);
}