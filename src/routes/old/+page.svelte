<script lang="ts">
	import './style.scss';
	import { fixInputHeight, initialTheme, themeSetters, elements } from './common.svelte';
	import Footer from '$lib/components/Footer.svelte';

	themeSetters[initialTheme]();

	const onInputMount = (node: HTMLTextAreaElement) => {
		elements.input = node;

		if (localStorage.tarask_text) {
			elements.input.value = localStorage.tarask_text;
		}
		fixInputHeight();
	};

	import('./main/index.svelte.ts');
</script>

<header>
	<div>
		<h1>Тарашкевізатар</h1>
	</div>
	<div id="theme">
		<input type="checkbox" class="checkbox" id="theme-light" value="0" title="Сьветлая" /><input
			type="checkbox"
			class="checkbox"
			id="theme-dark"
			value="2"
			title="Цёмная"
		/>
	</div>
</header>

<main>
	<div class="card">
		<div class="subcard" id="official">
			<div class="subcard_header">Афіцыйны</div>
			<div class="textfield-cont">
				<textarea
					id="input"
					use:onInputMount
					class="textfield"
					placeholder="Тэкст"
					style="height: 519px">{__DEFAULT_TEXT__}</textarea
				>
			</div>
			<div class="subcard_footer">
				<div class="icon-btns" id="input-btns">
					<button class="copy" title="Капіяваць"></button>
					<button id="clear" title="Ачысьціць"></button>
					<button id="info" title="Інфармацыя"></button>
				</div>
				<div class="num-counter">0</div>
			</div>
		</div>
		<div class="subcard" id="classic">
			<div class="subcard_header">Клясычны</div>
			<div class="textfield-cont">
				<output id="output" class="textfield"></output>
			</div>
			<div class="subcard_footer">
				<div class="icon-btns" id="output-btns">
					<button class="copy" title="Капіяваць"></button>
					<button id="showSettings" title="Налады"></button>
					<button id="edit" title="Рэдагаваць рэзультат"></button>
				</div>
				<div class="num-counter">0</div>
			</div>
		</div>
	</div>

	<ul id="settings" class="hidden">
		<li class="select">
			<div class="title">Альфабэт</div>
			<div class="options" id="abc">
				<button value="0">кірылічны</button>
				<button value="1">лацінскі</button>
				<button value="2">
					арабскі
					<div class="small">(не&nbsp;стандартызаваны)</div>
				</button>
				<button value="3">
					лацінскі
					<div class="small">(зь&nbsp;ji)</div>
				</button>
			</div>
		</li>
		<li class="select">
			<div class="title">і > й пасьля галосных</div>
			<div class="options" id="j">
				<button value="0">ніколі</button>
				<button value="1">выпадкова</button>
				<button value="2">заўсёды</button>
			</div>
		</li>
		<li class="select">
			<div class="title">Адразу г > ґ</div>
			<div class="options" id="g">
				<button value="0">не</button>
				<button value="1">так</button>
			</div>
		</li>
		<li class="select">
			<div class="title">Ігнараваць caps</div>
			<div class="options" id="esc-caps">
				<button value="0">не</button>
				<button value="1">так</button>
			</div>
		</li>
		<li class="select">
			<div class="title">Канвэртацыя файлу</div>
			<div class="options" id="file-convert">
				<button id="upload-btn" tabindex="-1">
					<input type="file" id="upload" tabindex="0" />
					<label for="upload" id="upload-label" title="Файл ня выбраны" data-title="Файл выбраны">
						запампаваць
					</label>
				</button>
				<button tabindex="-1">
					<a id="download" href="#"> спампаваць </a>
				</button>
			</div>
		</li>
		<li class="select">
			<div class="title">Для памылак і прапановаў</div>
			<div class="options">
				<a href="https://t.me/GooseOb">
					<button tabindex="-1">telegram</button>
				</a>
				<a href="https://github.com/GooseOb/taraskevizatar/issues">
					<button tabindex="-1">github</button>
				</a>
			</div>
		</li>
		<li class="select">
			<div class="title">Іншае</div>
			<div class="options">
				<button id="update-app">абнавіць</button>
				<button id="delete-all-data">выдаліць усе зьвесткі</button>
			</div>
		</li>
		<li class="select">
			<div class="title">Перайсьці да новай вэрсіі</div>
			<div class="options">
				<a href="/">
					<button tabindex="-1">тык</button>
				</a>
			</div>
		</li>
	</ul>
</main>

<Footer />

<div class="hidden" id="snackbar"></div>
