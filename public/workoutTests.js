//Author Dirk

//workout tests
QUnit.asyncTest("testing workout add/edit/delete + user", function(assert){
	//create user so we can log in
	$.ajax({
		type: "POST",
		url: '/signup',
		data : {username: 'dirk', password: 'potato'},
		success: function(obj) {
			$.ajax({
				type: "POST",
				url: '/login',
				data : {username: 'dirk', password: 'potato'},
				success: function(obj) {
					//add workout
					$.ajax({
						type: "POST",
						url: "http://localhost:3000/workout",
						data: {userid: "544da3dbf00d960000117c14"},
						success: function(obj){
							var res = JSON.parse(obj);
							workoutID = res.content.workout._id;
							//Edit workout
							$.ajax({
								type: "PUT",
								url: "http://localhost:3000/workout",
								data: {workoutID: workoutID, date: new Date('Oct 23, 1919')},
								success: function(obj){
									var res = JSON.parse(obj);
									assert.equal(res.content.workout.date,'1919-10-23T04:00:00.000Z');

									$.ajax({
										type: "DELETE",
										url: "http://localhost:3000/workout",
										data: {workoutid: workoutID},
										success: function(obj){
											var res = JSON.parse(obj);
											assert.equal(res.content.succeeded, true);
											QUnit.start();
										}
									});
								}
							});
						}
					});
				}
			});
		}
	}); 
});

//now move on to exercise tests

//exercise tests
QUnit.asyncTest("testing exercise add/edit/delete", function(assert){

	//add workout
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/workout",
		data: {userid: "544da3dbfeed9eeee0117c14"}, //meaningless id, just a placehoder here
		success: function(obj) {
			var res = JSON.parse(obj);
			workoutID = res.content.workout._id;

			//get how many exercises are in the workout
			$.ajax({
				type: "GET",
				url: "http://localhost:3000/workout/single",
				data: {workoutID: workoutID},
				success: function(obj){
					var res = JSON.parse(obj);
					var exercises_len = res.content.workout.exercises.length; //use last since we just added it

					//add exercise to workout created in first part
					$.ajax({
						type: "POST",
						url: "http://localhost:3000/workout/exercises",
						data: {
							workoutID: workoutID, //the ID of the workout we want to add the exercise to
							exerciseName: 'bench',
							repCount: 5,
							setCount: 5,
							weight: 105,
						},
						success: function(obj){
							var res = JSON.parse(obj);
							
							console.log(res.content.workout.exercises.length);
							assert.equal(res.content.workout.exercises.length, exercises_len + 1);
							var exercises = res.content.workout.exercises;
							var exerciseID = exercises[exercises.length-1];
														
							//edit exercise
							$.ajax({
								type: "PUT",
								url: "http://localhost:3000/workout/exercises",
								data: {
									exerciseID: exerciseID, //the ID of the workout we want to add the exercise to
									repCount: 700,
								},
								success: function(obj) {
									var res = JSON.parse(obj);
									assert.equal(res.content.exercise.repCount,700);

									//delete workout we just created
									$.ajax({
										type: "DELETE",
										url: "http://localhost:3000/workout",
										data: {workoutid: workoutID},
										success: function(obj){
											var res = JSON.parse(obj);
											assert.equal(res.content.succeeded, true);
											QUnit.start();
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});
