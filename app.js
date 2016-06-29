var language;
var activeId;
var sortedCounter = 0; // how many times has the row been sorted
var failMessage = "<h3>Beklager, det skjedde en feil!</h3><p>Tjenesten fikk ikke respons fra datalageret til Statistisk Sentralbyrå.<br>SSB har faste nedetider hver dag pga. oppdatering av data. Dette kan være årsaken til feilen.</p><p>Beklager det inntrufne - vennligst forsøk igjen senere!</p>";
var displaySettings;

// Get list of all JSONs from SSB
function ssbAssetsList(){
	$.get('https://data.ssb.no/api/v0/dataset/list.json', {lang: language}, function(data){})
		.done(function(ssbList) {
			var selectForm = document.createElement('SELECT');
				selectForm.id = "ssbSelector";
				selectForm.name = "ssbSelector";
				for (dataset in ssbList.datasets) {
					var option = document.createElement("OPTION");
						option.value = ssbList.datasets[dataset].id;
						option.innerHTML = ssbList.datasets[dataset].title;
						selectForm.appendChild(option);
				}
			var statsHeader = document.getElementById("statsHeader");
				while (statsHeader.firstChild) statsHeader.removeChild(statsHeader.firstChild); 			// Remove existing selector select elements, if any 
				statsHeader.insertBefore(selectForm, document.getElementById("statsHeader").firstChild);	// Add the new selector element
	//		activeId = (activeId ? activeId : document.getElementById("statsHeader").elements.ssbSelector.value);
			activeId = document.getElementById("statsHeader").elements.ssbSelector.value;
			ssbGetSource();

			document.getElementById("statsHeader").addEventListener("change", ssbGetSource);
		})
	.fail(function(){
		document.getElementById('statsBrowser').innerHTML = failMessage;
		
	})
	.always(function(){
		ssbSettings();
		// MAKE IT MULTILINGUAL
		document.getElementById("languagepicker").addEventListener("change", function(){
			language = document.getElementById("languagepicker").elements.lang.value;
			ssbAssetsList();
			document.getElementById('showSettingsLabel').innerHTML = (language === "en" ? "Show settings" : "Vis innstillinger");
		})		
	});
};

// Get individual JSONs from SSB
function ssbGetSource(){
	var activeId = document.getElementById("statsHeader").elements.ssbSelector.value;
	let url = 'http://data.ssb.no/api/v0/dataset/' + activeId + '.json';
	$.get(url, {lang: language}, function(data){
	})
		.done(function(ssbJSON){
//			var sortableTable;
			var oldTable = document.getElementById("statsBrowser")
			// DELETE EXISTING TABLE
			while (oldTable.firstChild) oldTable.removeChild(oldTable.firstChild);
			oldTable.classList.remove("wide");

			JSONstatUtils.tbrowser(
				JSONstat(ssbJSON),
				document.getElementById("statsBrowser")
				,{ 
					tblclass: "mainTable",
					preset: "bigger",
					locale: "no-NB"
				}
			);

			// Format and tweak table rows and cells, show settings, make rows sortable
			tweakTable(document.getElementsByClassName("mainTable")[0]);
			ssbShowSettings();
			ssbInitSortTable();

		})
		.fail(function(){
			document.getElementById('statsBrowser').innerHTML = failMessage;
		})
		.always(function(){
			//	Add wrap-up code here, if neccecary
		}),'json'
};	


// SORT TABLE ROWS
function tableSorter(){
	var parentTable = document.getElementsByClassName("mainTable")[0];
	var sortAscending = true, i, lastClicked; 			

	// LISTEN FOR "SORTING CLICKS" IN TABLE HEADER
	this.attachTheadListeners = function () {
		var tableHeads = parentTable.getElementsByTagName('thead')[0].getElementsByTagName('th');
		for (tableHead of tableHeads) {
			tableHead.addEventListener("click", this.sortTable);
			tableHead.classList.add("sortable");
		}
	}

	// DO THE SORTING
	this.sortTable = function (event) {
		i 	= Array.prototype.indexOf.call(event.target.offsetParent.getElementsByTagName('thead')[0].getElementsByTagName('th'), event.target);
		var tableBody 	= event.target.offsetParent.getElementsByTagName('tbody')[0];
		var currentCell;
		var description;
/*
		for (var row = 0; row < tableBody.rows.length; row++) {
//			description = tableBody.rows[row].cells[0].innerText;
////////////
//			tableBody.rows[row].addEventListener("click", function(){
//				this.classList.toggle("selected");
//			});
////////////
			for (cell in tableBody.rows[row].cells) {
				if (cell > 0) {
					currentCell = tableBody.rows[row].cells[cell];
					currentCell.dataset.number = (currentCell.innerHTML).replace(/,/g, '');
					currentCell.dataset.title = description;
				}
			}
		}
*/

		var rowsArray 	= Array.prototype.slice.call(tableBody.rows).sort(function(a,b){
			if (i) {	
				a = parseFloat(a.children[i].dataset.number);
				b = parseFloat(b.children[i].dataset.number);
			} else {
				a = a.children[i].innerHTML;
				b = b.children[i].innerHTML;
			}
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});

		if (lastClicked === i && !(sortedCounter++ % 2)) rowsArray.reverse();
	//	if (lastClicked === i && (sortedCounter++ > 0)) rowsArray.reverse();

		lastClicked = function(x){return x;}(i);

		rowsArray.forEach(function(row, i){ tableBody.appendChild(row)});
	}
}


// Show settings table
function showSettings(){
	var showSettings = document.getElementById('showSettings');
		showSettings.innerHTML = (language === "en" ? "Show settings" : "Vis innstillinger");

		showSettings.addEventListener("click", function(){
			var settings = document.getElementsByClassName('mainTable')[0].caption;
			settings.style.display = "table-caption";

			var settingOptions = settings.querySelectorAll("select, input");

			for (var i = 0; i < settingOptions.length; i++) {
				settingOptions[i].addEventListener("change", ssbInitSortTable);
			};
		});
};


// MAKE THE SHOW SETTINGS FORM
function ssbSettings(){
	if (!window.settingsForm) {// ONLY DO THIS IF SETTIGNSFORM DOES NOT ALREADY EXIST!
		var showSettings = document.createElement('FORM');
			showSettings.setAttribute("id", "settingsForm");
			showSettings.setAttribute("name", "showSettings");

		var form = document.createElement('INPUT');
			form.setAttribute("type", "checkbox");
			form.setAttribute("name", "show");
			form.setAttribute("id", "showSettings");
			form.setAttribute("value", "show");

		var inputLabel = document.createElement("LABEL");
			inputLabel.setAttribute("for", "showSettings");
			inputLabel.setAttribute("id", "showSettingsLabel")
			inputLabel.innerHTML = ( language === "en" ? "Show settings" : "Vis innstillinger");

			showSettings.appendChild(form);
			showSettings.appendChild(inputLabel);

			// SHOW OR HIDE THE OPTIONS/TABLE CAPTION IF THE CHECKBOX IS CLICKED
			showSettings.addEventListener("change", ssbShowSettings);

		var options = document.getElementById("options");
			options.insertBefore(showSettings, options.firstChild);
	}
}

// Format and tweak table rows and cells
function tweakTable(tableBody){
	for (var row = 0; row < tableBody.rows.length; row++) {
		description = tableBody.rows[row].cells[0].innerText;
////////////
		tableBody.rows[row].addEventListener("click", function(){
			this.classList.toggle("selected");
		});
////////////
		for (cell in tableBody.rows[row].cells) {
			if (cell > 0) {
				currentCell = tableBody.rows[row].cells[cell];
				currentCell.dataset.number = (currentCell.innerHTML).replace(/,/g, '');
				currentCell.dataset.title = description;
			}
		}
	}
}

// TOGGLE SETTINGS DISPLAY ON CHECKBOX INTERACTION
function ssbShowSettings(){
	($("#showSettings").is(":checked") 
		? $($(".mainTable")[0].caption).css({"display": "table-caption"}) 
		: $($(".mainTable")[0].caption).hide()
	);
}

function ssbSettingsEventListeners(){
	$($(".mainTable")[0].caption).on("change", ssbInitSortTable);
}

function ssbAdjustTableWidth(container){
	if (window.innerWidth < container.firstChild.offsetWidth) {
		container.classList.add("wide");
	}
}

function ssbInitSortTable(){
	var sortableTable = new tableSorter();
	sortableTable.attachTheadListeners();
}

// INIT 
$().ready(function(){
	language = document.getElementById("languagepicker").elements.lang.value;
	ssbAssetsList();
	
	// KEEP AN EYE OUT FOR CHANGES
	var target = document.getElementById("statsBrowser");
	var config = { attributes: true, childList: true, characterData: true };
	var observer = new MutationObserver(function(mutations){
		mutations.forEach(function(mutation){
			ssbSettingsEventListeners();
	 		ssbAdjustTableWidth(target);
		});
	});
		observer.observe(target, config);
});