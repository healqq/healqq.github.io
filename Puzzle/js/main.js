var imageManager = ( function(){
		var isReady = false;
		var mainCanvas = document.getElementById('image-preview');
		var mainContext = mainCanvas.getContext('2d');
		var imageObj = new Image();
	
		var cropCanvas = document.getElementById('image-crop');
		var cropContext = cropCanvas.getContext('2d');
		
		var blockWidth = 64;
		var rawImageBlockWidth = 100;
		
		
		
			
		
		
		
		
		var getPartOfImage = ( function( row, col){
			console.log('row: ' + row);
			console.log('col: ' + col);
			cropContext.drawImage(
				imageObj, //image
				col * rawImageBlockWidth, //source X
				row * rawImageBlockWidth, //source Y
				rawImageBlockWidth, //source width
				rawImageBlockWidth, //source height
				0, 
				0,
				blockWidth,
				blockWidth);
				return cropCanvas;
		});
		var setImageToCanvas = ( function( canvas, image){
			var canvasContext = canvas.getContext('2d');
			canvasContext.drawImage( image, 0, 0);
		});
		var imageManagerReady =( function( callback){
			imageObj.onload = function() {
				mainContext.drawImage(imageObj, 0, 0);
				mainContext.scale(2,2);
			//	cropContext.drawImage(imageObj,0,0,100,100,0,0,64,64);
				callback();
			}
			imageObj.src = 'assets/example.jpg';
		});
		var clearCanvas = ( function( canvas){
			var canvasContext = canvas.getContext('2d');
			canvasContext.clearRect(0,0,canvas.width, canvas.height);
		});
		return {
			setImage: setImageToCanvas,
			getImagePart: getPartOfImage,
			ready: imageManagerReady,
			clear: clearCanvas
			
		}
		
	});

//operates with playfield
var fieldManager = (function( size ){
	
	var imageManagerInst = new imageManager();
	var moves = 0;
	var numbers = false;
	//$('#numbers-text').html( (numbers? 'on' : 'off' ) );
	
	$('#restart').on('click', function(){
		clearField();
		createField( size );
		$('.field-overlay').hide();
		}
	);
	
	$('#numbers-toggle').on('click', function(){
		numbers = !numbers;
		var buttonText = $('#numbers-toggle').text();
		$('#numbers-toggle').text( buttonText.replace( (numbers? 'show' : 'hide' ), (numbers? 'hide' : 'show' ) ) );
		//for( var i = 0; i < size * size; i++){
		//	updateBlockView( i );
		//}
		$('.block-img').toggle();
		$('.img-preview').toggle();
			
	});
	if ( (size === undefined) || ( size < 2 ) ){
		return undefined;
	}
	var field = {
		elements:[],
		free:0
	};
	
	
	
	var checkWin = ( function(){
		if ( $('.in-correct-place').length === size*size - 1 ){
			//$('.field-container').addClass('inactive');
			//alert('you win! gz!');
			$('.field-overlay').show();
		}
	});
	var isFieldCorrect = ( function(){
		var $free = $('.free');
	//	var freeBlockIndex = parseInt ($free.attr('id').replace('block-', '') );
		var freeBlockValue = Math.floor( parseInt ($free.attr('id').replace('block-', '') )/ size ) + ( ( (size/2 - Math.floor(size/2) ) > 0 ) ? 0: 1 );
		var totalSum = freeBlockValue;
		var currentIndexWeights = 0;
		var currentIndex = 0;
		for ( var i = 0; i < size; i++){
			for ( var j = 0; j < size; j ++ ){
				currentIndex = i * size + j;
				currentIndexWeights = 0;
				for ( var k = currentIndex; k < size*size; k++){
					
					if ( (k !== field.free ) && 
						( field.elements[currentIndex] > field.elements[k]) )
						currentIndexWeights++;
				}
				totalSum += currentIndexWeights;
				
				
			}
		}
		console.log( totalSum/2 - Math.floor( totalSum/2) );
		return !(totalSum/2 - Math.floor( totalSum/2) > 0 );
	});
	//updates view of the block by id
	var updateBlockView = (function( index){
		
		//	text = ( ( index === field.free)? '': '' + field.elements[index] ); 	
			var text = '';
			var $block = $('#block-'+ index);
			var blockCanvas = $block.children('canvas')[0];
			if ( index === field.free ){
				text = '';
				$block.addClass('free');
				imageManagerInst.clear( blockCanvas);
				
			}
			else{
				text = field.elements[index];
				$block.removeClass('free');
				//getting image from new free block to this block
				var image = $('#block-'+ field.free).children('canvas')[0];
				imageManagerInst.setImage( $block.children('canvas')[0], image);
			}
				
				
			
			
			if ( field.elements[index] === index + 1 ){
				$block.addClass('in-correct-place');
			}
			else{
				$block.removeClass('in-correct-place');
			}
		//	
		
		$block.html( text );
		
			
			
			
			
	});
	//function to swap to elements
	var swap = ( function( index1, index2, container){
			var temp = container[index1];
			container[index1] = container[index2];
			container[index2] = temp;
	});
	//trigger on clicking on the block
		//todo:
		//check, if cell is a neighbour with free cell +done
	var moveBlock = ( function( index){
		
			var oldFreeBlock = field.free;
			
			if ( !( 
					( Math.abs(index - oldFreeBlock) === size) ||
					( Math.abs(index - oldFreeBlock) === 1 ) 
					) 
				)
				return undefined;
			moves++;
			$('#moves-counter-text').html( moves);
			swap(index, field.free, field.elements);
			field.free = index;
			
			updateBlockView ( oldFreeBlock );
			updateBlockView ( field.free );
			checkWin();
	});
	//create a field of size * size
	var createField = ( function( fieldSize, index ){
		
		var fieldContainer = $('.field-container');
		$('.container-wrap').width( fieldSize * 80 );
		//filling values vector 
		var values = [];
		for (var i=0; i< fieldSize; i++){
			for (var j=0;j < fieldSize; j++){
				values[ i * fieldSize + j ] = i * fieldSize + j + 1;
			}
		}
		//cutting last one for free cell
		values = values.splice (0 , fieldSize*fieldSize-1);
	//	console.log(values);
		
		var getRandomValue = (function( values ){
			var randomIndex = Math.floor(Math.random() * values.length );
		//	console.log('array:' + values );
		//	console.log('random index:' + randomIndex);
			var result = values[randomIndex];
		//	console.log('result:' + result);
			//вырезаем данный элемент
			var newArray = values.splice ( randomIndex, 1);
			values = newArray;
			return result;
			
		});
		
		
		//create one line with length of size
		var createLine = (function( length, lineNumber ){
			var line = document.createElement('div');
			
			$(line).addClass('line')
			.appendTo(fieldContainer);
			for ( var i = 0; i < length; i ++ ){
				var blockValue = getRandomValue( values );
			//	console.log( values );
			//	console.log( blockValue );
				var block = document.createElement('div');
				$(block).addClass('block')
				.attr('id', 'block-'+ (lineNumber*length + i) )
				.html(''+ blockValue )
				.appendTo(line)
				.on('click', function(){
						var blockIndex = parseInt ($(this).attr('id').replace('block-', '') );
						moveBlock( blockIndex );
					});
					
				//picture
				var canvas = document.createElement('canvas');
				$(canvas).addClass('block-img')
				.appendTo(block);
				var imagePart = imageManagerInst.getImagePart(
					Math.floor( (blockValue -1 )/length),
					blockValue - 1 - Math.floor( (blockValue - 1 ) /length) * length
				);
				imageManagerInst.setImage( canvas, imagePart);
				
				
				//filling array
				//todo fill with random numbers
				field.elements[lineNumber*length + i] = blockValue;
				//checking if block in right position
				if ( (lineNumber * length + i + 1) === blockValue ){
					$(block).addClass('in-correct-place');
					
					
				}
				
			}
		})
		
		for ( var j = 0; j < fieldSize; j ++ ){
				createLine( fieldSize, j );
				
		}
		//setting last element as free
		field.elements[field.elements.length-1] = 0;
		field.free = field.elements.length - 1;
		updateBlockView ( field.free );
		
		$('#moves-counter-text').html( moves);
	//	console.log( field );
		
	});
	var clearField = ( function(){
		$('.line').remove();
	field = {
		elements:[],
		free:0
		};
	moves = 0;
	});
	
	//wating for pic to load
	imageManagerInst.ready( function(){
		createField( size );
		while (!isFieldCorrect() ){
			
			console.log( 'incorrect' );
			clearField();
			createField( size );
		}
	});
	//createField( size );
	
});