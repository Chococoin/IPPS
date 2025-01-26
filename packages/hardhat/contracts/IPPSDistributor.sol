// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract IPPSDistributor {
    address public owner;
    uint256 public constant WITHDRAW_THRESHOLD = 8 ether; // Minimum balance required to distribute funds
    uint256 public constant MAX_PAYOUT = 43690 ether; // Maximum payout per participant

    // Mappings and lists to manage the system
    mapping(address => bool) public hasDeposited; // Tracks if an address has already deposited
    mapping(address => address) public bridgers; // Maps each participant to their bridger
    mapping(address => uint256) public payouts; // Total amount paid out to each participant
    mapping(uint256 => address) public pub; // FIFO queue for the pub based on a mapping
    uint256 public pubStart = 0; // Index of the first participant in the pub
    uint256 public pubEnd = 0;   // Index of the next available space in the pub
    address public docker; // Current participant in the docker
    address[] public bridge; // List of bridges assigned to the current docker
    uint256 public participantCount; // Counter for the total number of participants

    // Event to log deposits
    event Deposit(address indexed sender, uint256 amount);

    // Event to log withdrawals
    event Withdraw(address indexed recipient, uint256 amount);

    // Constructor: Initializes the contract and sets the owner as the first participant in the docker
    constructor() payable {
        require(msg.value == 1 ether, "Owner must deposit 1 ether during deployment");

        owner = msg.sender; // The owner of the contract
        docker = owner; // The owner becomes the first participant in the docker
        hasDeposited[owner] = true;
        participantCount = 1;

        emit Deposit(owner, msg.value);
    }

    // Function to receive deposits
    receive() external payable {
        require(msg.value == 1 ether, "Deposit must be exactly 1 unit of the native currency");
        require(!hasDeposited[msg.sender], "Sender has already deposited");

        hasDeposited[msg.sender] = true;
        participantCount++;

        bridge.push(msg.sender); // Add to bridges
        bridgers[msg.sender] = docker; // Assign the current docker as the bridger
        if (bridge.length == 4) {
            completeDockerCycle(); // Transition the docker when 4 bridges are added
        }
        emit Deposit(msg.sender, msg.value);

        if (address(this).balance >= WITHDRAW_THRESHOLD) {
            distribute();
        }
    }

    // Complete the cycle for the current docker
    function completeDockerCycle() internal {
        if (pubStart < pubEnd) {
            // If the pub is not empty, promote the next one from the pub to docker.
            docker = removeFromPub();
        } else if (bridge.length > 0) {
            // If the pub is empty, promote the first bridge to docker
            docker = bridge[0];
        } else {
            revert("No participants available to promote to docker");
        }
        for (uint256 i = 1; i < bridge.length; i++) {
            addToPub(bridge[i]);
        }
        // Clear the bridges
        delete bridge;
    }

    // Add a participant to the pub
    function addToPub(address participant) internal {
        pub[pubEnd] = participant;
        pubEnd++;
    }

    // Remove the first participant from the pub
    function removeFromPub() internal returns (address) {
        require(pubStart < pubEnd, "Pub is empty");
        address participant = pub[pubStart];
        pubStart++;
        return participant;
    }

    // Distribute funds to participants
    function distribute() internal {
        uint256 balance = address(this).balance;
        require(balance >= WITHDRAW_THRESHOLD, "Balance is below the withdraw threshold");

        uint256 parts = 8; // Always divide into 8 parts
        uint256 amountPerPart = balance / parts;
        address current = bridgers[docker];
        uint256 generationsPaid = 0;

        while (current != address(0) && generationsPaid < 8) {
            // Move to the previous bridger
            current = bridgers[current];
            if (payouts[current] < MAX_PAYOUT) {
                uint256 payment = amountPerPart;

                if (payouts[current] + payment > MAX_PAYOUT) {
                    payment = MAX_PAYOUT - payouts[current];
                }

                (bool success, ) = current.call{value: payment}("");
                require(success, "Transfer failed");

                payouts[current] += payment;
                emit Withdraw(current, payment);
            }
            generationsPaid++;
        }
    }

    // Get the current balance of the contract
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
