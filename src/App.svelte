<script>
	import { onMount } from 'svelte'

	export let name

	let userName = 'cosme-de@ebay'
	let userId = '14643560'
	let limit = 15
	let itemNoList = []
	let itemDetailList = []
	let scriptDom

	window.callback = function(res) {
		console.log(res)
		itemNoList = res.Rows.map(v => v.Id)
		scriptDom.remove()

		getItemDetail()
	}

	onMount(async () => {
		// data = await fetch('https://rapi.ruten.com.tw/api/items/v2/list?gno=30201452439429%2C30184977060005%2C30201319974379%2C30184890888535%2C30184971307913%2C30201275268578%2C30201061291971%2C30201060935414%2C30201059079433%2C30193074285945%2C30184889978678%2C30201054011951%2C30184919680986%2C30201044072137%2C30201058799802%2C30184979312502%2C30201064379375%2C30184891439819%2C30193074258776%2C30184919016068%2C30201058780273%2C30201061216732%2C30184919668522%2C30184890752298%2C30202257969038%2C30201753264812%2C30202172851696%2C30201058243615%2C30184979578832%2C30184974777366&level=simple')
		// 	.then(x => x.json())
	})

	async function getItemList() {
		await getUserId()
		const itemListApi = `https://rtapi.ruten.com.tw/api/search/v3/index.php/core/seller/${userId}/prod?sort=ords/dc&limit=${limit}&offset=1&_callback=callback`
		scriptDom = document.createElement('script')
		scriptDom.src = itemListApi
		document.body.appendChild(scriptDom)
	}

	async function getItemDetail() {
		itemDetailList = await fetch(`http://localhost:3000/api/ruten?gno=${itemNoList.join()}`)
			.then(res => res.json())
			.then(res => res.data)

		console.log(itemDetailList)
	}

	async function getUserId() {
		userId = await fetch(`http://localhost:3000/api/user/${userName}`)
			.then(res => res.text())
	}

</script>

<main>
	<h1>
		<strong>{userName}</strong> 's<br>
		TOP <strong>{limit}</strong> Products
	</h1>

	User: <input bind:value={userName} placeholder="enter user name">
	Limit: <input bind:value={limit} placeholder="enter items limit">
	<button on:click={getItemList}>搜尋</button>

	{#if itemDetailList.length}
	<table>
		<thead>
			<tr>
				<th></th>
				<th>name</th>
				<th>price (NTD)</th>
				<th>price (USD)</th>
				<th>sold</th>
				<th>stock</th>
				<th>id</th>
				<th>link</th>
			</tr>
    </thead>
    <tbody>
			{#each itemDetailList as item (item.id)}
				<tr>
					<td>
						<img src="{item.images.m_url}" alt="" width="100" height="100">
					</td>
					<td>{item.name}</td>
					<td>{item.goods_price}</td>
					<td>{item.goods_ori_price}</td>
					<td>{item.sold_num}</td>
					<td>{item.num}</td>
					<td>{item.id}</td>
					<td><a href="https://goods.pchomeus.com/item/show?{item.id}" target="_blank">link</a></td>
				</tr>
			{/each}
    </tbody>
	</table>
	{/if}

	<!-- <pre>
		{JSON.stringify(itemDetailList, null, 2)}
	</pre> -->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		text-align: left;
		color: darkcyan;
		/* text-transform: uppercase; */
		font-size: 4em;
		font-weight: normal;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	table,
	td {
			border: 1px solid #333;
	}

	thead,
	tfoot {
			background-color: darkcyan;
			color: #fff;
	}
</style>