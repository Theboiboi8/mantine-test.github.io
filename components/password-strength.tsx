import { useState } from 'react';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
	// @ts-ignore
	return (
		<Text
			color={meets ? 'teal' : 'red'}
			sx={{ display: 'flex', alignItems: 'center' }}
			mt={7}
			size="sm"
		>
			{meets ? <ion-icon name="checkmark-outline"></ion-icon> : <ion-icon name="checkmark-outline"></ion-icon>} <Box ml={10}>{label}</Box>
		</Text>
	);
}

const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export function PasswordStrength() {
	const [popoverOpened, setPopoverOpened] = useState(false);
	const [value, setValue] = useState('');
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
	));

	const strength = getStrength(value);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

	return (
		<Popover
			opened={popoverOpened}
			position="bottom"
			placement="start"
			withArrow
			styles={{ popover: { width: '100%' } }}
			noFocusTrap
			transition="pop-top-left"
			onFocusCapture={() => setPopoverOpened(true)}
			onBlurCapture={() => setPopoverOpened(false)}
			target={
				<PasswordInput
					required
					label="Your password"
					placeholder="Your password"
					description="Strong password should include letters in lower and uppercase, at least 1 number, at least 1 special symbol"
					value={value}
					onChange={(event) => setValue(event.currentTarget.value)}
				/>
			}
		>
			<Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
			<PasswordRequirement label="Includes at least 6 characters" meets={value.length > 5} />
			{checks}
		</Popover>
	);
}